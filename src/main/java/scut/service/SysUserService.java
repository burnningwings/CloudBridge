package scut.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import scut.domain.Organization;
import scut.service.authority.user.SysUser;

import javax.annotation.Resource;
import java.util.Set;


@Service
public class SysUserService {
    @Resource
    OrganizationService organizationService;

    public SysUser getSysUser() {
        return (SysUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public Organization getUserOrganization() {
        return getSysUser().getOrganization();
    }

    public Long getUserOrganizationId() {
        return getUserOrganization().getId();
    }

    public Set<Organization> getUserInferiorOrganizations() {
        return getUserOrganization().getInferiorOrganizations();
    }

    public Set<Long> getUserInferiorOrganizationIds() {
        return organizationService.getOrganizationIds(getUserInferiorOrganizations());
    }

//    public Set<Organization> getUserSuperiorOrganizations() {
//        return getUserOrganization().getSuperiorOrganizations();
//    }

//    public Set<Long> getUserSuperiorOrganizationIds() {
//        return organizationService.getOrganizationIds(getUserSuperiorOrganizations());
//    }

    public boolean userInferiorOrganizationContains(Long organizationId) {
        return getUserInferiorOrganizationIds().contains(organizationId);
    }

    public boolean userInferiorOrganizationContains(Organization organization) {
        return getUserInferiorOrganizations().contains(organization);
    }

//    public boolean userSuperiorOrganizationContains(Long organizationId) {
//        return getUserSuperiorOrganizationIds().contains(organizationId);
//    }
//
//    public boolean userSuperiorOrganizationContains(Organization organization) {
//        return getUserSuperiorOrganizations().contains(organization);
//    }
}
