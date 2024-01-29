package com.api.apipublicinterface.controller;


import com.api.apipublicinterface.model.User;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * 测试接口服务
 */

@RestController
@RequestMapping("/name")
public class NameController {


    @GetMapping("/")
    public String getNameByGet(String name) {

        return "GET 你的名字是" + name;
    }

    // 路径传参
    @PostMapping("/")
    public String getNamePost(@RequestParam String name) {
        return "POST 你的名字是" + name;
    }

    // json
    @PostMapping("/user")
    public String getUserNamePost(@RequestBody User user, HttpServletRequest request) {
        String accessKey = request.getHeader("accessKey");
        String secretKey = request.getHeader("secretKey");
        if (!accessKey.equals("ak") || !secretKey.equals("sk")) {
            throw new RuntimeException("无权限");
        }
        return "POSTJSON 你的名字是" + user.getUsername();
    }
}
