---
categories: troubleshooting
layout: article
title: "1) Triage Overview"
---

This page serves as a guide to help you understand, narrow down, and solve algorithm- and platform-related issues.

Although Algorithmia has a support team that can help you with platform-related issues, it's usually quicker and more efficient to troubleshoot on your own when possible. Here we provide you with the tools to do so.

If you reach the end of the triage process and you've narrowed down your issue but still haven't reached a resolution, please [provide us with detailed information](/developers/administration/troubleshooting/4-information-gathering) so that we're able to support you as effectively as possible.

## 5xx errors

If you receive a `5xx` error you should report it as an incident, [providing detailed information](/developers/administration/troubleshooting/4-information-gathering) so that we can get to the root of the issue as quickly as possible.

## Runtime-related issues

Runtime-related issues can have any of several different root causes, so there are multiple routes you can take for troubleshooting them. First, see if you can narrow down the issue into one of the following categories:

*   [AuthN/AuthZ](/developers/administration/troubleshooting/2-issues#authentication-authorization-and-resource-access)
*   [Input/output serialization](/developers/administration/troubleshooting/2-issues#json-serialization-of-inputoutput)
*   [Timeouts](/developers/administration/troubleshooting/2-issues#timeouts)

If you're able to reproduce the issue and it doesn't fall into one of these categories, or if you've tried to troubleshoot using the information provided on these pages and are not able to resolve the issue, please [contact our Algorithm Engineering team](/developers/administration/troubleshooting/4-information-gathering) with the required information and the results of your efforts to reproduce the issue.

## Build-related issues

See [common issues related to builds](/developers/administration/troubleshooting/2-issues#build-issues). Reach out to PSE or Algorithm Engineering team with your findings from your attempts to reproduce the issue.

## UI/UX issues

If applicable, try to understand the cause of the problem by [inspecting the browser requests](/developers/administration/troubleshooting/3-strategies/#inspect-a-browser-requestresponse) in the Developer Tools pane. If you're able to reproduce but not resolve the issue, please [contact our support team](/developers/administration/troubleshooting/4-information-gathering).