import { Html } from "@elysiajs/html";

export const menubar = (routePath) => (
  <menu class="nav nav-pills">
    <li class="nav-heading text-2xl font-medium">arduino-webcli</li>
    <li class="item nav-item">
      <a href="/gui/compile" class={routePath == "/compile" ? "active" : ""}>
        <span class="text">编译</span>
      </a>
    </li>
    <li class="item nav-item">
      <a href="/gui/core" class={routePath == "/core" ? "active" : ""}>
        <span class="text">主核管理</span>
      </a>
    </li>
    <li class="item nav-item">
      <a href="/gui/lib" class={routePath == "/lib" ? "active" : ""}>
        <span class="text">库管理</span>
      </a>
    </li>
  </menu>
);
