package scut.controller;

import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import scut.service.SysUserService;

import javax.annotation.Resource;
import java.util.HashSet;
import java.util.Set;

@RestController
public class Organization {
    @Resource
    SysUserService sysUserService;

    @GetMapping(path = "/self-and-inferior-organizations")
    @JsonView(scut.domain.Organization.WithIdAndName.class)
    public Set<scut.domain.Organization> getSelfAndInferiorOrganizations() {
        Set<scut.domain.Organization> inferiorOrganizations =
                new HashSet<>(sysUserService.getUserInferiorOrganizations());
        inferiorOrganizations.add(sysUserService.getUserOrganization());
        return inferiorOrganizations;
    }
}
