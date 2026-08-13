---
title: "Transformer Attention Block Basics"
summary: "Transformer 中 Multi-Head Attention、Feed Forward、Add & Norm 和残差连接的核心逻辑。"
category: "Machine Learning"
tags:
  - transformer
  - attention
  - multi-head attention
  - feed forward
  - residual connection
  - layer normalization
created: 2026-08-13
updated: 2026-08-13
math: true
---

# Transformer Block 详细笔记

这是一份“能直接背题目/复现计算逻辑”的版本。  

目标是：把一个 Transformer block 拆成 4 个可复用子结构，并看清每一步的输入输出、维度和数值含义。

---

## 0. 记号约定

设输入序列为 $X\in\mathbb{R}^{L\times d_{\text{model}}}$，  
$L$ 是 token 长度，$d_{\text{model}}$ 是模型维度。  

- $L$：token 数（序列长度）
- $d_{\text{model}}$：每个 token 的 embedding 维度
- $d_k,d_v$：单头中 key/value/query 的投影维度
- $h$：head 数
- $W_i^Q\in\mathbb{R}^{d_{\text{model}}\times d_k}$，  
  $W_i^K\in\mathbb{R}^{d_{\text{model}}\times d_k}$，  
  $W_i^V\in\mathbb{R}^{d_{\text{model}}\times d_v}$

下文不区分行向量/列向量方向，统一使用矩阵乘法视角。

---

## 1. 单头注意力（scaled dot-product attention）

给定某一头的

$$
Q = XW^Q,\quad
K = XW^K,\quad
V = XW^V,
$$

其中 $Q,K,V\in\mathbb{R}^{L\times d_k}$（若 $d_v=d_k$ 也常见）。

注意力权重：

$$
\operatorname{Att}(Q,K,V)=\operatorname{Softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V.
$$

### 为什么要除以 $\sqrt{d_k}$？

$Q_i^\top K_j$ 的方差随 $d_k$ 增大，$\sqrt{d_k}$ 缩放可以避免 softmax 在大维度时过早饱和，防止梯度太小。

### Mask（掩码）

在自回归解码中，常见上三角 mask，阻止当前 token 看见未来 token：

$$
S = \frac{QK^\top}{\sqrt{d_k}} + M,\quad
M_{ij}=
\begin{cases}
0,&j\le i\\
-\infty,&j>i
\end{cases}
$$

$$
A=\operatorname{Softmax}(S),\quad O=AV.
$$

---

## 2. Multi-Head Attention（MHA）

单头可能只能捕获一种相关性。MHA 在低维子空间并行建模多个关系：

$$
\mathrm{head}_i = \operatorname{Att}(XW_i^Q,\;XW_i^K,\;XW_i^V),\quad i=1,\dots,h
$$

$$
\mathrm{MHA}(X)=\mathrm{Concat}\!\left(\mathrm{head}_1,\dots,\mathrm{head}_h\right)W^O.
$$

其中 $W^O\in\mathbb{R}^{hd_v\times d_{\text{model}}}$。  
实际中常取 $d_k=d_v=d_{\text{model}}/h$，这样每个头的维度一致、拼接后回到 $d_{\text{model}}$。

---

## 3. Add + Norm（残差连接 + 归一化）

Transformer 最关键的稳定模块之一是：

$$
y = \operatorname{LayerNorm}(x + \mathrm{MHA}(x)).
$$

直观上它同时承担两件事：

- 残差：保留原始信息通道，避免深层梯度消失；
- 归一化：每层输出尺度保持在可训练范围，减少层间分布漂移。

### LayerNorm 一句话

$$
\operatorname{LayerNorm}(u)=\gamma \odot \frac{u-\mu}{\sigma+\epsilon}+\beta
$$

其中 $(\mu,\sigma)$ 是特征维度内按 token 计算的均值/标准差。  

---

## 4. Feed-Forward Network（FFN）

注意力负责“token 间交流”，FFN 负责“每个 token 的非线性变换”。  

$$
\mathrm{FFN}(x)=W_2\,\sigma(W_1x+b_1)+b_2.
$$

常见结构是两层 MLP：

$$
d_{\text{model}} \rightarrow d_{\text{ff}} \rightarrow d_{\text{model}},
$$

每个 token 独立处理，不发生 token 间混合。

---

## 5. 典型 Block 的两种放置

### Post-LN（原始形式）

$$
\tilde{x}= \operatorname{LayerNorm}(x + \mathrm{MHA}(x))
$$

$$
z = \operatorname{LayerNorm}(\tilde{x} + \mathrm{FFN}(\tilde{x}))
$$

### Pre-LN（常见于稳定大模型）

$$
\tilde{x}=x+\mathrm{MHA}(\operatorname{LayerNorm}(x))
$$

$$
z=\tilde{x}+\mathrm{FFN}(\operatorname{LayerNorm}(\tilde{x}))
$$

两者差别在于 LN 的插入顺序不同，但都保持了“交流-残差-非线性-残差”的骨架。

---

## 6. 梯度与收敛直觉（考试答题好句）

1. 残差提供短路路径，梯度可以绕过复杂子层流到更前层，训练更稳。
2. 层归一化让每层输出方差不至于发散/崩塌。
3. FFN 与 MHA 在 token 维度上是互补关系：前者建模语法关系，后者建模 token 内部变换。  

这可以直接写成：

$$
x\ \xrightarrow{\text{MHA}}\ x_{\text{attn}}
\xrightarrow{\text{Res+Norm}}\ x_1
\xrightarrow{\text{FFN}}\ x_{\text{ffn}}
\xrightarrow{\text{Res+Norm}}\ z
$$

---

## 7. 实现常见坑（建议直接记）

1. scaled 漏乘：$\sqrt{d_k}$ 忘了会导致早期饱和。
2. mask 加法要做在 softmax 前，不要直接在概率上乘 $0/1$。
3. pad token 处理要同步 attention mask 与标签损失 mask。
4. Dropout 常放在 attention 权重和 FFN 输出后。
5. 数值稳定：先减去每行最大值再 softmax。

---

## 8. 你可以这样记住一句话

Transformer block 的本质不是“复杂地再变换”，而是：

1) 先把 token 间关系用注意力编码；  
2) 用残差保留原语义、用归一化防止发散；  
3) 再对每个 token 做非线性增强；  
4) 再次残差+归一化形成下一层输入。  

这就是在固定预算下兼顾表达能力与可训练性的标准解法。

