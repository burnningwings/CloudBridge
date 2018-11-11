package scut.controller;

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
import java.util.*;

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

    @RequestMapping("/")
    public String index(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "index";
    }

    @RequestMapping("/test")
    public String test(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "test";
    }

    @RequestMapping("/bridge")
    public String bridge(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "bridge";

    }

    @RequestMapping("/section")
    public String section(Model model, Integer bridgeId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        model.addAttribute("bridge_id", bridgeId == null ? 0 : bridgeId);
        return "section";
    }

    @RequestMapping("/watch-point")
    public String watchPoint(Model model, Integer bridgeId, Integer sectionId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        bridgeId = bridgeId == null ? 0 : bridgeId;
        sectionId = bridgeId == 0 || sectionId == null ? 0 : sectionId;
        model.addAttribute("bridge_id", bridgeId);
        model.addAttribute("section_id", sectionId);
        return "watch-point";
    }

    @RequestMapping("/watch-box")
    public String watchBox(Model model, Integer bridgeId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        model.addAttribute("bridge_id", bridgeId == null ? 0 : bridgeId);
        return "watch-box";
    }

    @RequestMapping("/overweight-analysis")
    public String overweightAnalysis(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "overweight-analysis";
    }

    @RequestMapping("/damage-detection")
    public String damageDetection(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "damage-detection";
    }

    @RequestMapping("/association-analysis")
    public String associationAnalysis(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "association-analysis";
    }

    @RequestMapping("/wavelet-analysis")
    public String waveletAnalysis(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "wavelet-analysis";
    }

    @RequestMapping("/user-manager")
    public String userManager(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "user-manager";
    }

    
    @RequestMapping("/role-manager")
    public String roleManager(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "role-manager";
    }

    @RequestMapping("/403")
    public String failedView() {

        return "failedView";
    }

    @RequestMapping("/query-data")
    public String queryData(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "query-data";
    }

    @RequestMapping("/upload-data")
    public String uploadData(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "upload-data";
    }

    @RequestMapping("/sensor")
    public String sensor(Model model, Integer bridgeId, Integer sectionId, Integer watchPointId, Integer watchBoxId) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
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
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "log_bridge";
    }

    @RequestMapping("/log_system")
    public String log_system(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "log_system";
    }

    @RequestMapping("/log_option")
    public String log_option(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "log_option";
    }

    @RequestMapping("/bridge_type")
    public String bridge_type(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "bridge_type";
    }

    @RequestMapping("/watchbox_type")
    public String watchbox_type(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "watchbox_type";
    }

    @RequestMapping("/watchpoint_para")
    public String watchpoint_para(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
        return "watchpoint_para";
    }

    @GetMapping("/{from}/image-upload/{objectId}")
    public String imageUpload(Model model,
                              @PathVariable("from") String from,
                              @PathVariable("objectId") long objectId) {
        model.addAttribute("from", from);
        model.addAttribute("fromName", URLToName.get(from));
        model.addAttribute("objectId", objectId);

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);

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

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);

        return "image";
    }
}
