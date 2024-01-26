package com.yupi.project.common;

import lombok.Data;

import java.io.Serializable;

/**
 * 通用返回类
 *
 * @param <T>
 * @author yupi
 */
@Data
public class BaseResponse<T> implements Serializable {

    private int code;

    private T data;

    private String message;

    private Boolean success;

    public BaseResponse(int code, T data, String message,Boolean success) {
        this.code = code;
        this.data = data;
        this.message = message;
        this.success=success;
    }

    public BaseResponse(int code, T data) {
        this(code, data, "",true);
    }

    public BaseResponse(ErrorCode errorCode) {
        this(errorCode.getCode(), null, errorCode.getMessage(),errorCode.getSuccess());
    }
}
