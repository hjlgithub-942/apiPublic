package com.api.apipublicinterface;

import com.api.apipublicinterface.client.publicClient;
import com.api.apipublicinterface.model.User;

public class Main {
    public static void main(String[] args) {
        String accessKey = "ak";
        String secretKey = "sk";
        publicClient myPublicClient = new publicClient(accessKey,secretKey);
        String result1 = myPublicClient.getNameByGet("我的名字");
        String result2 = myPublicClient.getNamePost("你的名字");

        User user = new User();
        user.setUsername("他的名字");

        String result3 = myPublicClient.getUserNamePost(user);
        System.out.println(result1);
        System.out.println(result2);
        System.out.println(result3);

    }
}
