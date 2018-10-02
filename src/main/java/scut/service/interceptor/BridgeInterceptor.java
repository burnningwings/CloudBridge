package scut.service.interceptor;

import com.alibaba.fastjson.JSONObject;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import scut.domain.Organization;
import scut.service.OrganizationService;
import scut.service.SysUserService;
import scut.util.HttpResponseBuilder;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Aspect
@Component
public class BridgeInterceptor {
    @Resource
    SysUserService sysUserService;

    @Resource
    OrganizationService organizationService;

    @Resource
    HttpResponseBuilder httpResponseBuilder;

    @Pointcut("execution(* scut.controller.Bridge.createOrUpdateBridge(..)) && args(requestBody)")
    private void createOrUpdateBridgeOperation(JSONObject requestBody) {
    }

    @Pointcut("execution(* scut.controller.Bridge.bridgeInfo(..)) && args(bridgeId)")
    private void retrieveBridgeInfoOperation(Integer bridgeId) {
    }

    @Pointcut("execution(* scut.controller.Bridge.deleteBridge(..)) && args(requestBody)")
    private void deleteBridgeOperation(JSONObject requestBody) {
    }

    @Around("createOrUpdateBridgeOperation(requestBody)")
    public Object processCreateOrUpdateBridgeOperation(ProceedingJoinPoint joinPoint, JSONObject requestBody)
            throws Throwable {
        String operationType = requestBody.getString("operationType");
        Long organizationId = requestBody.getLong("organizationId");
        long bridgeDirectOrganizationId = Long.MIN_VALUE;
        if ("update".equals(operationType)) {
            bridgeDirectOrganizationId = organizationService
                    .getBridgeDirectOrganization(requestBody.getLong("bridgeId")).getId();
        }
        if (("update".equals(operationType) &&
                sysUserService.isUserUnmanageableOrganization(bridgeDirectOrganizationId)) ||
                sysUserService.isUserUnmanageableOrganization(organizationId)) {
            return httpResponseBuilder.getFailedHttpResponse("您没有权限新建或修改属于此单位的桥梁！");
        }
        return joinPoint.proceed();
    }

    @Around("retrieveBridgeInfoOperation(bridgeId)")
    public Object processRetrieveBridgeInfoOperation(ProceedingJoinPoint joinPoint, Integer bridgeId)
            throws Throwable {
        Long bridgeDirectOrganizationId;
        try {
            bridgeDirectOrganizationId = organizationService.getBridgeDirectOrganization(bridgeId).getId();
        } catch (NullPointerException e) {
            return joinPoint.proceed();
        }
        if (sysUserService.isUserUnmanageableOrganization(bridgeDirectOrganizationId)) {
            return httpResponseBuilder.getFailedHttpResponse("您没有权限查看该桥梁的信息！");
        }
        return joinPoint.proceed();
    }

    @Around("deleteBridgeOperation(requestBody)")
    public Object processDeleteBridgeOperation(ProceedingJoinPoint joinPoint, JSONObject requestBody)
            throws Throwable {
        String checkedListStr = requestBody.getString("checkedList");

        List<Long> bridgeIds = Arrays.stream(checkedListStr.split(", *"))
                .map(Long::valueOf).collect(Collectors.toList());
        List<Organization> directOrganizations =
                organizationService.getBridgeDirectOrganizationsByBridgeIds(bridgeIds);
        if (sysUserService.isUserUnmanageableOrganizations(directOrganizations)) {
            return httpResponseBuilder
                    .getFailedHttpResponse("删除桥梁失败，请检查要删除的桥梁是否都由您的单位或其下级单位管辖！");
        }
        return joinPoint.proceed();
    }
}
