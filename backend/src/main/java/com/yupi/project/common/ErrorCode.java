package com.yupi.project.common;

/**
 * 错误码
 *
 * @author yupi
 */
public enum ErrorCode {

    SUCCESS(0, "ok", true),
    PARAMS_ERROR(40000, "请求参数错误", false),
    NOT_LOGIN_ERROR(40100, "未登录", false),
    NO_AUTH_ERROR(40101, "无权限", false),
    NOT_FOUND_ERROR(40400, "请求数据不存在", false),
    FORBIDDEN_ERROR(40300, "禁止访问", false),
    SYSTEM_ERROR(50000, "系统内部异常", false),
    OPERATION_ERROR(50001, "操作失败", false);

    /**
     * 状态码
     */
    private final int code;

    /**
     * 信息
     */
    private final String message;

    /**
     *  状态值
     */
    private final Boolean success;

    ErrorCode(int code, String message,Boolean success) {
        this.code = code;
        this.message = message;
        this.success = success;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public Boolean getSuccess() {
        return success;
    }

}
