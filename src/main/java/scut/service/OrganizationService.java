package scut.service;

import org.springframework.stereotype.Service;
import scut.domain.Organization;
import scut.repository.OrganizationRepository;

import javax.annotation.Resource;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class OrganizationService {
    @Resource
    OrganizationRepository organizationRepository;

    Set<Long> getOrganizationIds(Set<Organization> organizations) {
        Set<Long> organizationIds = new HashSet<>();
        for (Organization o : organizations) {
            organizationIds.add(o.getId());
        }
        return organizationIds;
    }

    public Long getBridgeDirectOrganizationId(long bridgeId) {
        try {
            return getBridgeDirectOrganization(bridgeId).getId();
        } catch (NullPointerException e) {
            return null;
        }
    }

    public Long getBridgeDirectOrganizationIdBySectionId(long sectionId) {
        try {
            return getBridgeDirectOrganizationBySectionId(sectionId).getId();
        } catch (NullPointerException e) {
            return null;
        }
    }

    public Long getBridgeDirectOrganizationIdByWatchBoxId(long watchBoxId) {
        try {
            return getBridgeDirectOrganizationByWatchBoxId(watchBoxId).getId();
        } catch (NullPointerException e) {
            return null;
        }
    }

    public Long getSysUserDirectOrganizationId(long sysUserId) {
        try {
            return getSysUserDirectOrganization(sysUserId).getId();
        } catch (NullPointerException e) {
            return null;
        }
    }

    public String getSysUserDirectOrganizationName(long sysUserId) {
        try {
            return getSysUserDirectOrganization(sysUserId).getName();
        } catch (NullPointerException e) {
            return "";
        }
    }

    public Organization getBridgeDirectOrganization(long bridgeId) {
        return organizationRepository.findOrganizationByBridgeId(bridgeId);
    }

    private Organization getBridgeDirectOrganizationBySectionId(long sectionId) {
        return organizationRepository.findOrganizationBySectionId(sectionId);
    }

    private Organization getBridgeDirectOrganizationByWatchBoxId(long watchBoxId) {
        return organizationRepository.findOrganizationByWatchBoxId(watchBoxId);
    }

    private Organization getSysUserDirectOrganization(long sysUserId) {
        return organizationRepository.findOrganizationBySysUserId(sysUserId);
    }

    public List<Organization> getBridgeDirectOrganizationsByBridgeIds(List<Long> bridgeIds) {
        return organizationRepository.findOrganizationsByBridgeIds(bridgeIds);
    }

    public List<Organization> getBridgeDirectOrganizationsBySectionIds(List<Long> sectionIds) {
        return organizationRepository.findOrganizationsBySectionIds(sectionIds);
    }

    public List<Organization> getBridgeDirectOrganizationsByWatchBoxIds(List<Long> watchBoxIds) {
        return organizationRepository.findOrganizationsByWatchBoxIds(watchBoxIds);
    }

    public List<Organization> getBridgeDirectOrganizationsByWatchPointIds(List<Long> watchPointIds) {
        return organizationRepository.findOrganizationsByWatchPointIds(watchPointIds);
    }

    public List<Organization> getSysUserDirectOrganizationsBySysUserIds(List<Long> sysUserIds) {
        return organizationRepository.findOrganizationsBySysUserIds(sysUserIds);
    }
}
