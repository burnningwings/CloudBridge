package scut.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import scut.domain.Organization;

import java.util.List;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    @Query(value = "select o from Bridge b join b.directOrganization o where b.id = ?1")
    Organization findOrganizationByBridgeId(long bridgeId);

    @Query(value = "select o from Bridge b join b.directOrganization o where b.id in :ids")
    List<Organization> findOrganizationsByBridgeIds(@Param("ids") List<Long> bridgeIds);

    @Query(value = "select o from Bridge b join b.directOrganization o join b.sections s where s.id in :ids")
    List<Organization> findOrganizationsBySectionIds(@Param("ids") List<Long> sectionIds);

    @Query(value = "select o from Bridge b join b.directOrganization o join b.watchBoxes w where w.id in :ids")
    List<Organization> findOrganizationsByWatchBoxIds(@Param("ids") List<Long> watchBoxIds);

    @Query(value = "select o from WatchPoint w join w.section s join s.bridge b join b.directOrganization o where w.id in :ids")
    List<Organization> findOrganizationsByWatchPointIds(@Param("ids") List<Long> watchPointIds);
}
