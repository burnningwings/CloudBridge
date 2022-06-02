package scut.service.authority.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import scut.domain.Bridge;
import scut.domain.Organization;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Created by Carrod on 2018/4/21.
 */
@Entity
public class SysUser implements UserDetails {
    @Id
    @GeneratedValue
    private Long id;
    private String username;
    private String password;
    /**
     * 增加用户表信息
     * by xiaoah
     */
    private String truename;
    private String department;
    private String duty;

    @ManyToOne
    @JoinColumn(
            name = "organization_id",
            referencedColumnName = "id",
            foreignKey = @ForeignKey(name = "fk_sys_user_organization_id"))
    private Organization organization;

    @ManyToMany(cascade = {CascadeType.REFRESH}, fetch = FetchType.EAGER)
    @JoinTable(
            name = "sys_user_roles",
            joinColumns = @JoinColumn(
                    name = "sys_user_id",
                    referencedColumnName = "id",
                    foreignKey = @ForeignKey(name = "fk_sys_user_roles_sys_user_id")),
            inverseJoinColumns = @JoinColumn(
                    name = "roles_id",
                    referencedColumnName = "id",
                    foreignKey = @ForeignKey(name = "fk_sys_user_roles_roles_id")))
    private List<SysRole> roles;

//    @ManyToMany(cascade = {CascadeType.REFRESH},fetch = FetchType.EAGER)
//    @JoinTable(
//            name = "sys_user_bridge",
//            joinColumns = @JoinColumn(
//                    name = "uid",
//                    referencedColumnName = "id"
//            ),
//            inverseJoinColumns = @JoinColumn(
//                    name = "bid",
//                    referencedColumnName = "bridge_id"
//            )
//    )
//    private List<Bridge> bridges;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setTruename(String truename) {
        this.truename = truename;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setDuty(String duty) {
        this.duty = duty;
    }

    public String getDepartment() {
        return department;
    }

    public String getDuty() {
        return duty;
    }

    public String getTruename() {
        return truename;
    }


    public List<SysRole> getRoles() {
        return roles;
    }

    public void setRoles(List<SysRole> roles) {
        this.roles = roles;
    }

//    public List<Bridge> getBridges() {
//        return bridges;
//    }
//
//    public void setBridges(List<Bridge> bridges) {
//        this.bridges = bridges;
//    }
//
//    public List<Long> getControlBridge() {
//        List<Long> bridge = new ArrayList<>();
//        List<Bridge> bridges = this.getBridges();
//        for (Bridge b : bridges){
//            bridge.add(b.getId());
//        }
//        return bridge;
//    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> auths = new ArrayList<GrantedAuthority>();
        List<SysRole> roles = this.getRoles();
        for (SysRole role : roles) {
            auths.add(new SimpleGrantedAuthority(role.getName()));
        }
        return auths;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String toString() {
        return String.format("SysUser: {" + "\n" +
                        "id: %d" + "\n" +
                        "username: %s" + "\n" +
                        "password: %s" + "\n" +
                        "truename: %s" + "\n" +
                        "department: %s" + "\n" +
                        "duty: %s" + "\n" +
                        "organization: %s" + "\n" +
                        "}" + "\n",
                this.id,
                this.username,
                this.password,
                this.truename,
                this.department,
                this.duty,
                this.organization == null ? "null" : this.organization.getName());
    }
}
