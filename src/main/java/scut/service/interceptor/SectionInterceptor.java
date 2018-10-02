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
public class SectionInterceptor {
    @Resource
    SysUserService sysUserService;

    @Resource
    OrganizationService organizationService;

    @Resource
    HttpResponseBuilder httpResponseBuilder;

    @Pointcut("execution(* scut.controller.Section.createOrUpdate(..)) && args(requestBody)")
    private void createOrUpdateSectionOperation(JSONObject requestBody) {
    }

    @Pointcut("execution(* scut.controller.Section.sectionInfo(..)) && args(sectionId)")
    private void retrieveSectionInfoOperation(Integer sectionId) {
    }

    @Pointcut("execution(* scut.controller.Section.delete(..)) && args(requestBody)")
    private void deleteSectionOperation(JSONObject requestBody) {
    }

    @Around("createOrUpdateSectionOperation(requestBody)")
    public Object processCreateOrUpdateSectionOperation(ProceedingJoinPoint joinPoint, JSONObject requestBody)
            throws Throwable {
        String operationType = requestBody.getString("operationType");
        long sectionDirectOrganizationId = Long.MIN_VALUE;
        // bridgeId 为 section 所属桥梁
        long bridgeId = requestBody.getLong("bridgeId");
        long bridgeDirectOrganizationId = organizationService.getBridgeDirectOrganizationId(bridgeId);
        if ("update".equals(operationType)) {
            long sectionId = requestBody.getLong("sectionId");
            // 可能找不到 sectionId 所对应的截面而抛出异常
            sectionDirectOrganizationId = organizationService.getBridgeDirectOrganizationIdBySectionId(sectionId);
        }

        if (("update".equals(operationType) &&
                sysUserService.isUserUnmanageableOrganization(sectionDirectOrganizationId)) ||
                sysUserService.isUserUnmanageableOrganization(bridgeDirectOrganizationId)) {
            return httpResponseBuilder.getFailedHttpResponse("您没有权限新建或修改属于此桥梁的截面！");
        }
        return joinPoint.proceed();
    }

    @Around("retrieveSectionInfoOperation(sectionId)")
    public Object processRetrieveSectionInfoOperation(ProceedingJoinPoint joinPoint, Integer sectionId)
            throws Throwable {
        long sectionDirectOrganizationId;
        try {
            sectionDirectOrganizationId = organizationService.getBridgeDirectOrganizationIdBySectionId(sectionId);
        } catch (NullPointerException e) {
            return joinPoint.proceed();
        }
        if (sysUserService.isUserUnmanageableOrganization(sectionDirectOrganizationId)) {
            return httpResponseBuilder.getFailedHttpResponse("您没有权限查看该截面的信息！");
        }
        return joinPoint.proceed();
    }

    @Around("deleteSectionOperation(requestBody)")
    public Object processDeleteSectionOperation(ProceedingJoinPoint joinPoint, JSONObject requestBody)
            throws Throwable {
        String checkedListStr = requestBody.getString("checkedList");
        List<Long> sectionIds = Arrays.stream(checkedListStr.split(", *"))
                .map(Long::valueOf).collect(Collectors.toList());
        List<Organization> directOrganizations =
                organizationService.getBridgeDirectOrganizationsBySectionIds(sectionIds);
        if (sysUserService.isUserUnmanageableOrganizations(directOrganizations)) {
            return httpResponseBuilder
                    .getFailedHttpResponse("删除截面失败，请检查要删除的截面是否都由您的单位或其下级单位管辖！");
        }
        return joinPoint.proceed();
    }
}
