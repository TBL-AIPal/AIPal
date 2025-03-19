# AI Pal User Guide

Welcome to **AI Pal**, a web app designed to help educators and students contextualize large language models (LLMs) for educational purposes. This guide will walk you through the features, functionalities, and known issues of the platform so you can make the most of your experience.

---

## Table of Contents
1. [Overview](#1-overview)  
2. [Getting Started](#2-getting-started)  
   - [Creating an Account](#creating-an-account)  
   - [Logging In](#logging-in)  
3. [Teacher Features](#3-teacher-features)  
   - [Creating Courses](#creating-courses)  
   - [Uploading Materials](#uploading-materials)  
   - [Building Knowledge Bases](#building-knowledge-bases)  
4. [Rooms](#4-rooms)  
   - [What Are Rooms?](#what-are-rooms)  
   - [Configuring Room Templates](#configuring-room-templates)  
5. [Student Features](#5-student-features)  
6. [Known Issues](#6-known-issues)  
7. [Tips for Optimal Use](#7-tips-for-optimal-use)  

---

## 1. Overview <a id="1-overview"></a>

**AI Pal** is a web app tailored for educators and students. Teachers can create courses, upload materials, and build knowledge bases that are used by LLMs to provide contextually relevant responses. Students and teachers can interact with these models in chat-based environments called "rooms." Each room can be customized to suit specific needs by configuring templates, adding constraints, and selecting subsets of uploaded materials.

---

## 2. Getting Started <a id="2-getting-started"></a>

### Creating an Account <a id="creating-an-account"></a>
1. Visit the AI Pal website.
2. Click on **Sign Up**.
3. Fill in the required details (name, email, password).
4. Wait for an admin to approve the account.

### Logging In <a id="logging-in"></a>
1. Go to the AI Pal website.
2. Click on **Log In**.
3. Enter your email and password.
4. You will be redirected to the dashboard.

---

## 3. Teacher Features <a id="3-teacher-features"></a>

### Creating Courses <a id="creating-courses"></a>
1. From the dashboard, click on **Create Course**.
2. Enter the course name, description, and model keys.
3. Create the course.

### Uploading Materials <a id="uploading-materials"></a>
1. Navigate to the course you created.
2. Click on **Materials**.
3. Select files (as of now we only allow PDF, make sure that it is text-based) from your computer.
4. Once uploaded, the materials will be processed to build a knowledge base for the LLM.

### Building Knowledge Bases <a id="building-knowledge-bases"></a>
- After uploading materials, AI Pal automatically processes them to create a knowledge base.
- This knowledge base is used by the LLM to provide contextually relevant responses in rooms.

---

## 4. Rooms <a id="4-rooms"></a>

### What Are Rooms? <a id="what-are-rooms"></a>
Rooms are interactive chat pages where teachers and students can communicate with the LLM. Each room is configured using a template that determines how the model responds, and you can enter the room by using the room code.

### Configuring Room Templates <a id="configuring-room-templates"></a>
1. From the course page, click on **Templates**.
2. Create a **Template**:
   - Add **Constraints**: Define rules or limitations for the LLM's responses (e.g., "Response in 3 sentences").
   - Select **Materials**: Choose a subset of uploaded materials to focus the LLM's responses.
3. Save the configuration.
4. You can now create the room.

---

## 5. Student Features <a id="5-student-features"></a>

- Coming soon!

---

## 6. Known Issues <a id="6-known-issues"></a>

- **Large Documents in Templates**: When large documents are selected in a room template, the response time may be significantly delayed. In some cases, the server or client may time out before the response is finalized. This issue occurs because the server takes too long to process the request.  
  - **Workaround 1**: Try selecting smaller subsets of materials or breaking large documents into smaller sections.  
  - **Workaround 2**: The request is still being processed even after a timeout, so refreshing the page after some time will yield the model response.

---

Thank you for testing **AI Pal**! Your feedback is invaluable in helping us refine the platform. If you have any questions or suggestions, please reach out to **ai.pal.dev@gmail.com**.
