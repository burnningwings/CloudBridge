package scut.service.authority.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * Created by Carrod on 2018/4/21.
 * 数据访问接口
 */
public interface SysUserRepository extends JpaRepository<SysUser, Long> {
//    @Query(value = "select s from SysUser s join fetch s.organization o " +
//            "left join fetch o.directInferiorOrganizations where s.username = ?1")
    SysUser findByUsername(String username);
}
