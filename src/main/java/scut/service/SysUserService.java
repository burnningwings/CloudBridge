package scut.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import scut.domain.Organization;
import scut.service.authority.user.SysUser;

import javax.annotation.Resource;
import java.util.List;
import java.util.Set;


@Service
public class SysUserService {
    @Resource
    OrganizationService organizationService;

    private SysUser getSysUser() {
        return (SysUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public Long getUserId() {
        return getSysUser().getId();
    }

    public Organization getUserOrganization() {
        return getSysUser().getOrganization();
    }

    public Long getUserOrganizationId() {
        return getUserOrganization().getId();
    }

    public Set<Organization> getUserInferiorOrganizations() {
        return getUserOrganization().getAllInferiorOrganizations();
    }

    public Set<Long> getUserInferiorOrganizationIds() {
        return organizationService.getOrganizationIds(getUserInferiorOrganizations());
    }

    public Set<Long> getUserSelfAndInferiorOrganizationIds() {
        Set<Long> s = getUserInferiorOrganizationIds();
        s.add(getUserOrganizationId());
        return s;
    }

    public boolean userInferiorOrganizationContains(Long organizationId) {
        return getUserInferiorOrganizationIds().contains(organizationId);
    }

    public boolean userInferiorOrganizationContains(Organization organization) {
        return getUserInferiorOrganizations().contains(organization);
    }

    public boolean isUserUnmanageableOrganization(Long organizationId) {
        return !(getUserOrganizationId().equals(organizationId) ||
                userInferiorOrganizationContains(organizationId));
    }

    public boolean isUserUnmanageableOrganizations(List<Organization> organizations) {
        for (Organization o : organizations) {
            if (isUserUnmanageableOrganization(o.getId())) {
                return true;
            }
        }
        return false;
    }

    public boolean isUserUnmanageableUser(Long userId) {
        Long userDirectOrganizationId = organizationService.getSysUserDirectOrganizationId(userId);
        return !(getUserOrganizationId().equals(userDirectOrganizationId) ||
                userInferiorOrganizationContains(userDirectOrganizationId));
    }
}
