package com.api.apipublicinterface.controller;


import com.api.apipublicsdk.model.User;
import com.api.apipublicsdk.utils.SignUtils;
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
    public String getUsernameByPost(@RequestBody User user, HttpServletRequest request) {
        String accessKey = request.getHeader("accessKey");
        String nonce = request.getHeader("nonce");
        String timestamp = request.getHeader("timestamp");
        String sign = request.getHeader("sign");
        String body = request.getHeader("body");
//        // todo 实际情况应该是去数据库中查是否已分配给用户
        if (!accessKey.equals("yupi")) {
            throw new RuntimeException("无权限");
        }
        if (Long.parseLong(nonce) > 10000) {
            throw new RuntimeException("无权限");
        }
        // todo 时间和当前时间不能超过 5 分钟
//        if (timestamp) {
//
//        }
        // todo 实际情况中是从数据库中查出 secretKey
        String serverSign = SignUtils.genSign(body, "abcdefgh");
        if (!sign.equals(serverSign)) {
            throw new RuntimeException("无权限");
        }
        // todo 调用次数 + 1 invokeCount
        String result = "POST 用户名字是" + user.getUsername();
        return result;
    }
}
