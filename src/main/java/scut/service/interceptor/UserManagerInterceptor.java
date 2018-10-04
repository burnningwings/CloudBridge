package scut.service.interceptor;

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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Aspect
@Component
public class UserManagerInterceptor {
    @Resource
    SysUserService sysUserService;

    @Resource
    OrganizationService organizationService;

    @Resource
    HttpResponseBuilder httpResponseBuilder;

    @Pointcut("execution(* scut.controller.UserManager.CreateUser(..)) && args(requestBody)")
    private void createUserOperation(Map<?, ?> requestBody) {
    }

    @Pointcut("execution(* scut.controller.UserManager.UpdateUserInfo(..)) && args(userId)")
    private void retrieveUserInfoOperation(String userId) {
    }

    @Pointcut("execution(* scut.controller.UserManager.UpdateUser(..)) && args(requestBody)")
    private void updateUserOperation(Map<?, ?> requestBody) {
    }

    @Pointcut("execution(* scut.controller.UserManager.DeleteUser(..)) && args(requestBody)")
    private void deleteUserOperation(Map<?, ?> requestBody) {
    }

    @Around("createUserOperation(requestBody)")
    public Object processCreateUser(ProceedingJoinPoint joinPoint, Map<?, ?> requestBody) throws Throwable {
        Long organizationId = Long.valueOf(requestBody.get("organization_id").toString());
        if (sysUserService.isUserUnmanageableOrganization(organizationId)) {
            return httpResponseBuilder.getFailedHttpResponse("您没有权限创建属于该单位的用户！");
        }
        return joinPoint.proceed();
    }

    @Around("retrieveUserInfoOperation(userId)")
    public Object processRetrieveUserInfo(ProceedingJoinPoint joinPoint, String userId) throws Throwable {
        if (userId != null && sysUserService.isUserUnmanageableUser(Long.valueOf(userId))) {
            return httpResponseBuilder.getFailedHttpResponse("您没有权限查看该用户的信息！");
        }
        return joinPoint.proceed();
    }

    @Around("updateUserOperation(requestBody)")
    public Object processUpdateUser(ProceedingJoinPoint joinPoint, Map<?, ?> requestBody) throws Throwable {
        Long organizationId = Long.valueOf(requestBody.get("organization_id").toString());
        if (sysUserService.isUserUnmanageableOrganization(organizationId)) {
            return httpResponseBuilder.getFailedHttpResponse("您没有权限新建或修改属于此单位的用户！");
        }
        return joinPoint.proceed();
    }

    @Around("deleteUserOperation(requestBody)")
    @SuppressWarnings("unchecked")
    public Object processDeleteUser(ProceedingJoinPoint joinPoint, Map<?, ?> requestBody) throws Throwable {
        try {
            ArrayList<String> checkedSysUsers = (ArrayList<String>) requestBody.get("user_checked_list");
            List<Organization> checkedSysUserOrganizations =
                    organizationService.getSysUserDirectOrganizationsBySysUserIds(
                            checkedSysUsers.stream().map(Long::valueOf).collect(Collectors.toList()));
            if (sysUserService.isUserUnmanageableOrganizations(checkedSysUserOrganizations)) {
                return httpResponseBuilder
                        .getFailedHttpResponse("删除用户失败，请检查要删除的用户是否都由您的单位或其下级单位管辖！");
            }
        } catch (ClassCastException e) {
            return httpResponseBuilder.getFailedHttpResponse("参数类型错误，请检查所有参数！");
        }
        return joinPoint.proceed();
    }
}
