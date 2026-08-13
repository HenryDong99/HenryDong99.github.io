---
title: "可移动天线建模速记"
summary: "整理可移动天线研究中常见的几何变量、信道表达和位置约束，作为后续推导的统一入口。"
category: "Wireless Communications"
tags:
  - movable antenna
  - channel modeling
  - optimization
created: 2026-08-12
updated: 2026-08-12
math: true
---

## 记录目标

这篇笔记用于统一可移动天线问题中的基础记号。建立新模型时，先明确天线位置、传播路径和优化变量分别属于哪一层，避免在算法推导中混用物理量与辅助变量。

## 基本变量

- 用 $\mathbf{x}_n\in\mathbb{R}^d$ 表示第 $n$ 根天线的位置。
- 用 $\mathcal{C}$ 表示允许天线移动的区域。
- 用 $d_{\min}$ 表示任意两根天线之间要求保持的最小距离。
- 用 $L$ 表示参与建模的有效传播路径数。

典型的位置可行域可以写为

$$
\mathbf{x}_n\in\mathcal{C},\qquad
\lVert\mathbf{x}_n-\mathbf{x}_m\rVert_2\ge d_{\min},\quad n\ne m.
$$

## 路径叠加形式

一个便于后续优化的抽象表达是

$$
\mathbf{h}(\mathbf{x})=
\sum_{\ell=1}^{L}\alpha_{\ell}
\mathbf{a}(\mathbf{x},\theta_{\ell}),
$$

其中 $\alpha_{\ell}$ 表示第 $\ell$ 条路径的复增益，$\theta_{\ell}$ 表示与该路径相关的方向或几何参数，$\mathbf{a}(\mathbf{x},\theta_{\ell})$ 描述阵列位置对相位的影响。

## 建模检查清单

1. 坐标单位和波长单位是否一致。
2. 近场与远场采用的距离模型是否明确。
3. 路径数在一次实验中是否保持一致。
4. 天线间距约束是否覆盖所有天线对。
5. 优化后报告的是实际物理指标，还是算法中的代理目标。
