package scut.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import scut.service.ImageService;
import scut.service.authority.CurrentUser;
import scut.util.Constants;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Carrod on 2018/4/19.
 */

@Controller
public class Home {

    @Resource
    ImageService imageService;

    private static Map<String, String> URLToName;

    static {
        URLToName = new HashMap<>();
        URLToName.put("bridge", "桥梁信息");
        URLToName.put("section", "截面管理");
        URLToName.put("watch-point", "监测点管理");
    }

    private void setUser(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
    }

    @RequestMapping("/")
    public String index(Model model) {
        setUser(model);
        return "index";
    }

    @RequestMapping("/test")
    public String test(Model model) {
        setUser(model);
        return "test";
    }

    @RequestMapping("/bridge")
    public String bridge(Model model) {
        setUser(model);
        return "bridge";

    }

    @RequestMapping("/section")
    public String section(Model model, Integer bridgeId) {
        setUser(model);
        model.addAttribute("bridge_id", bridgeId == null ? 0 : bridgeId);
        return "section";
    }

    @RequestMapping("/watch-point")
    public String watchPoint(Model model, Integer bridgeId, Integer sectionId) {
        setUser(model);
        bridgeId = bridgeId == null ? 0 : bridgeId;
        sectionId = bridgeId == 0 || sectionId == null ? 0 : sectionId;
        model.addAttribute("bridge_id", bridgeId);
        model.addAttribute("section_id", sectionId);
        return "watch-point";
    }

    @RequestMapping("/watch-box")
    public String watchBox(Model model, Integer bridgeId) {
        setUser(model);
        model.addAttribute("bridge_id", bridgeId == null ? 0 : bridgeId);
        return "watch-box";
    }

    @RequestMapping("/overweight-analysis")
    public String overweightAnalysis(Model model) {
        setUser(model);
        return "overweight-analysis";
    }

    @RequestMapping("/damage-detection")
    public String damageDetection(Model model) {
        setUser(model);
        return "damage-detection";
    }

    @RequestMapping("/association-analysis")
    public String associationAnalysis(Model model) {
        setUser(model);
        return "association-analysis";
    }

    @RequestMapping("/wavelet-analysis")
    public String waveletAnalysis(Model model) {
        setUser(model);
        return "wavelet-analysis";
    }

    @RequestMapping("/user-manager")
    public String userManager(Model model) {
        setUser(model);
        return "user-manager";
    }


    @RequestMapping("/role-manager")
    public String roleManager(Model model) {
        setUser(model);
        return "role-manager";
    }

    @RequestMapping("/403")
    public String failedView() {

        return "failedView";
    }

    @RequestMapping("/query-data")
    public String queryData(Model model) {
        setUser(model);
        return "query-data";
    }

    @RequestMapping("/upload-data")
    public String uploadData(Model model) {
        setUser(model);
        return "upload-data";
    }

    @RequestMapping("/sensor")
    public String sensor(Model model, Integer bridgeId, Integer sectionId, Integer watchPointId, Integer watchBoxId) {
        setUser(model);
        bridgeId = bridgeId == null ? 0 : bridgeId;
        sectionId = bridgeId == 0 || sectionId == null ? 0 : sectionId;
        watchPointId = sectionId == 0 || watchPointId == null ? 0 : watchPointId;
        watchBoxId = bridgeId == 0 || watchBoxId == null ? 0 : watchBoxId;

        model.addAttribute("bridge_id", bridgeId);
        model.addAttribute("section_id", sectionId);
        model.addAttribute("watch_point_id", watchPointId);
        model.addAttribute("watch_box_id", watchBoxId);
        return "sensor";
    }

    @RequestMapping("/log_bridge")
    public String log_gridge(Model model) {
        setUser(model);
        return "log_bridge";
    }

    @RequestMapping("/log_system")
    public String log_system(Model model) {
        setUser(model);
        return "log_system";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping("/log_option")
    public String log_option(Model model) {
        setUser(model);
        return "log_option";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping("/bridge_type")
    public String bridge_type(Model model) {
        setUser(model);
        return "bridge_type";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping("/watchbox_type")
    public String watchbox_type(Model model) {
        setUser(model);
        return "watchbox_type";
    }

    @RequestMapping("/watchpoint_para")
    public String watchpoint_para(Model model) {
        setUser(model);
        return "watchpoint_para";
    }

    @GetMapping("/{from}/image-upload/{objectId}")
    public String imageUpload(Model model,
                              @PathVariable("from") String from,
                              @PathVariable("objectId") long objectId) {
        model.addAttribute("from", from);
        model.addAttribute("fromName", URLToName.get(from));
        model.addAttribute("objectId", objectId);

        setUser(model);

        return "image-upload";
    }

    @GetMapping("/{from}/image/{objectId}")
    public String listImages(Model model,
                             @PathVariable("from") String from,
                             @PathVariable("objectId") long objectId) {
        model.addAttribute("from", from);
        model.addAttribute("fromName", URLToName.get(from));
        model.addAttribute("objectId", objectId);
        model.addAttribute("imageBaseURI", imageService.getImageBaseURI(from, objectId));
        model.addAttribute("ImageFilenames", imageService.getImageFilenames(from, objectId));
        model.addAttribute("imageURIs", imageService.getImageURIs(from, objectId));

        setUser(model);

        return "image";
    }
}
