---
permalink: /notes/
title: "Notes"
description: "Research notes on wireless communications, optimization, and academic reading."
author_profile: false
---

<header class="notes-intro">
  <p class="notes-intro__eyebrow">Knowledge Base</p>
  <h1>Notes</h1>
  <p>这里整理无线通信、优化方法和论文阅读中的可复用知识。笔记会持续修订，因此以更新时间而非发表时间为主。</p>
</header>

{% assign notes = site.notes | sort: "updated" | reverse %}

<div class="notes-grid">
  {% for note in notes %}
    <article class="note-card">
      <div class="note-card__meta">
        {% if note.category %}<span>{{ note.category }}</span>{% endif %}
        {% if note.updated %}<time datetime="{{ note.updated | date: '%Y-%m-%d' }}">{{ note.updated | date: "%Y-%m-%d" }}</time>{% endif %}
      </div>
      <h2><a href="{{ note.url | relative_url }}">{{ note.title }}</a></h2>
      {% if note.summary %}<p>{{ note.summary }}</p>{% endif %}
      {% if note.tags %}
        <ul class="note-card__tags" aria-label="Tags">
          {% for tag in note.tags %}<li>{{ tag }}</li>{% endfor %}
        </ul>
      {% endif %}
    </article>
  {% else %}
    <p>笔记正在整理中。</p>
  {% endfor %}
</div>
