package scut.service;

import org.springframework.stereotype.Service;
import scut.domain.Organization;
import scut.repository.OrganizationRepository;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class OrganizationService {
    @Resource
    OrganizationRepository organizationRepository;

    public Set<Long> getOrganizationIds(Set<Organization> organizations) {
        Set<Long> organizationIds = new HashSet<>();
        for (Organization o : organizations) {
            organizationIds.add(o.getId());
        }
        return organizationIds;
    }

    public Organization getBridgeDirectOrganization(long bridgeId) {
        return organizationRepository.findOrganizationByBridgeId(bridgeId);
    }

    public long getBridgeDirectOrganizationId(long bridgeId) {
        return getBridgeDirectOrganization(bridgeId).getId();
    }

//    public Set<Organization> getInferiorOrganizationsOfBridgeDirectOrganization(long bridgeId) {
//        return getBridgeDirectOrganization(bridgeId).getInferiorOrganizations();
//    }
//
//    public Set<Long> getInferiorOrganizationIdsOfBridgeDirectOrganization(long bridgeId) {
//        return getOrganizationIds(getInferiorOrganizationsOfBridgeDirectOrganization(bridgeId));
//    }

//    public Set<Organization> getSuperiorOrganizationsOfBridgeDirectOrganization(long bridgeId) {
//        return getBridgeDirectOrganization(bridgeId).getSuperiorOrganizations();
//    }

//    public Set<Long> getSuperiorOrganizationIdsOfBridgeDirectOrganization(long bridgeId) {
//        return getOrganizationIds(getSuperiorOrganizationsOfBridgeDirectOrganization(bridgeId));
//    }

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
}
