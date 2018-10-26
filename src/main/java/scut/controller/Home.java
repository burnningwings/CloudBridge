package scut.controller;

import com.sun.org.apache.xpath.internal.operations.Mod;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import scut.service.authority.CurrentUser;
import scut.util.Constants;

/**
 * Created by Carrod on 2018/4/19.
 */

@Controller
public class Home {

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
    public String watchBox(Model model) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CurrentUser currentUser = new CurrentUser(userDetails.getUsername());
        model.addAttribute(Constants.CURRENT_USER, currentUser);
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
    public String failedView(){

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
}
