import createProject from "/home/ryan/the_odin_project/todo-list/src/modules/project";

function setActiveButton(button: HTMLButtonElement) {
  const buttons = document.querySelectorAll(".button-nav");
  buttons.forEach((btn) => {
      if (btn !== button) {
          btn.classList.remove("active");
      }
  });
  button.classList.add("active");
}

function createHeader() {
  const header = document.createElement("header") as HTMLElement;
  const logo = document.createElement("div") as HTMLDivElement;
  const pageName = document.createElement("h1") as HTMLHeadingElement;
  const button = document.createElement("button") as HTMLButtonElement;
  const hamburgerIcon1 = document.createElement("div") as HTMLDivElement;
  const hamburgerIcon2 = document.createElement("div") as HTMLDivElement;
  const hamburgerIcon3 = document.createElement("div") as HTMLDivElement;

  pageName.textContent = "Todo List";

  header?.classList.add("flex", "flex-wrap", "justify-between", "p-3", "bg-blue-600");
  pageName?.classList.add("text-white", "font-bold");
  button?.classList.add("space-y-q", "sm:hidden");
  hamburgerIcon1?.classList.add("w-8", "h-1", "bg-white");
  hamburgerIcon2?.classList.add("w-8", "h-1", "bg-white");
  hamburgerIcon3?.classList.add("w-8", "h-1", "bg-white");

  logo.appendChild(pageName);
  button.appendChild(hamburgerIcon1);
  button.appendChild(hamburgerIcon2);
  button.appendChild(hamburgerIcon3);
  header.appendChild(logo);
  header.appendChild(button);

  return header;
}

function createMain() {
  const main = document.createElement("main") as HTMLElement;
  const nav = document.createElement("nav") as HTMLElement;
  const defaultProjects = document.createElement("div") as HTMLDivElement;
  const allTasksBtn = document.createElement("button") as HTMLButtonElement;
  const todaysTasksBtn = document.createElement("button") as HTMLButtonElement;
  const weeksTasksBtn = document.createElement("button") as HTMLButtonElement;
  const projects = document.createElement("div") as HTMLDivElement;
  const projectHeading = document.createElement("h1") as HTMLHeadingElement;
  const projectList = document.createElement("div") as HTMLDivElement;
  const projectButton = document.createElement("button") as HTMLButtonElement;
  const tasks = document.createElement("div") as HTMLDivElement;

  projectHeading.textContent = "Projects";
  allTasksBtn.textContent = "All Tasks";
  todaysTasksBtn.textContent = "Today";
  weeksTasksBtn.textContent = "This Week";
  projectButton.textContent = "Add Project";

  main.classList.add("flex", "flex-col", "justify-between", "min-h-[calc(100vh-88px)]", "sm:flex-row");
  nav.classList.add("p-5", "bg-blue-200", "sm:w-64");
  defaultProjects.classList.add("flex", "flex-col");
  allTasksBtn.classList.add("hover:bg-blue-300", "m-2", "p-1", "sm:text-left");
  todaysTasksBtn.classList.add("hover:bg-blue-300", "m-2", "p-1", "sm:text-left");
  weeksTasksBtn.classList.add("hover:bg-blue-300", "m-2", "p-1", "sm:text-left");
  projects.classList.add("flex", "flex-col", "mt-3");
  projectHeading.classList.add("text-lg", "font-bold", "text-center", "sm:text-left");
  projectButton.classList.add("hover:bg-blue-300", "m-2", "p-1", "sm:text-left");
  tasks.classList.add("flex", "flex-col", "p-5");

  tasks.setAttribute("id", "tasks");

  defaultProjects.appendChild(allTasksBtn);
  defaultProjects.appendChild(todaysTasksBtn);
  defaultProjects.appendChild(weeksTasksBtn);
  projects.appendChild(projectHeading);
  projects.appendChild(projectList);
  projects.appendChild(projectButton);
  nav.appendChild(defaultProjects);
  nav.appendChild(projects);

  main.appendChild(nav);
  main.appendChild(tasks);

  allTasksBtn.classList.add("button-nav");
  allTasksBtn?.addEventListener("click", (e) => {
    if ((e.target as HTMLButtonElement).classList.contains("active")) {
      return;
    }
    setActiveButton(allTasksBtn);
    createProject("All Tasks");
  });

  todaysTasksBtn.classList.add("button-nav");
  todaysTasksBtn?.addEventListener("click", (e) => {
    if ((e.target as HTMLButtonElement).classList.contains("active")) {
      return;
    }
    setActiveButton(todaysTasksBtn);
    createProject("Today's Tasks");
  });

  weeksTasksBtn.classList.add("button-nav");
  weeksTasksBtn?.addEventListener("click", (e) => {
    if ((e.target as HTMLButtonElement).classList.contains("active")) {
      return;
    }
    setActiveButton(weeksTasksBtn);
    createProject("This Week's Tasks");
  });

  // projectButton.classList.add("button-nav");
  // projectButton?.addEventListener("click", (e) => {
  //   if ((e.target as HTMLButtonElement).classList.contains("active")) {
  //     return;
  //   }
  //   setActiveButton(projectButton);
  //   loadWeeksTasks();
  // });
  // setActiveButton(projectButton);

  return main;
}

function createFooter() {
  const footer = document.createElement("footer") as HTMLElement;
  const paragraph = document.createElement("p") as HTMLParagraphElement;
  
  paragraph.textContent = "Copyright © 2023 phammings";

  footer.classList.add("flex", "bg-black", "h-10", "items-center", "justify-center");
  paragraph.classList.add("text-white");

  footer.appendChild(paragraph);
  return footer;
}

function initializeWebsite() {
  const content = document.querySelector<HTMLBodyElement>("#content");
  content!.textContent = "";
  content?.appendChild(createHeader());
  content?.appendChild(createMain());
  content?.appendChild(createFooter());

  setActiveButton(document.querySelector(".button-nav")!);
  //  Default Homepage
  createProject("All Tasks");
}



initializeWebsite();