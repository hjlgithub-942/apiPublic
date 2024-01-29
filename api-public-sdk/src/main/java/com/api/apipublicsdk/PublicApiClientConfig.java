package com.api.apipublicsdk;

import com.api.apipublicsdk.client.YuApiClient;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("apipublic.client")
@Data
@ComponentScan
public class PublicApiClientConfig {

    private String accessKey;

    private String secretKey;

    @Bean
    public YuApiClient yuApiClient() {
        return new YuApiClient(accessKey, secretKey);
    }


}
