package scut.service.authority.user;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by Carrod on 2018/4/21.
 * 数据访问接口
 */
public interface SysUserRepository extends JpaRepository<SysUser, Long> {
    SysUser findByUsername(String username);
}
