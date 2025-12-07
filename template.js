const generatePostConfig = () => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  const config = `
---
title: xxxx
category: xxxx
tag:
  - xxx
  - xxx
description: 
date: ${dateStr}

author: nikola
icon: paw

isOriginal: true
sticky: false
timeline: true
article: true
star: false
---

`;

  return config;
}

console.log(generatePostConfig());