package com.ttrss.module.label.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * tt-rss 用户标签关联实体类
 * 对应数据库表：ttrss_user_labels2
 */
@Data
@TableName("ttrss_user_labels2")
public class UserLabel implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键 ID (自增)
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 标签 ID (关联 ttrss_labels2.id)
     */
    private Integer labelId;

    /**
     * 文章 ID (关联 ttrss_user_entries.int_id)
     */
    private Integer articleId;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
}
