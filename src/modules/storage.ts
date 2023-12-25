import {Task} from "./task";
import {auth, database} from "./firebase";

function saveTasks(tasks: Task[], projectName: string) {
    if (projectName == "All Tasks" || projectName == "Today's Tasks" || projectName == "This Week's Tasks") {
        localStorage.setItem("All Tasks", JSON.stringify(tasks));
        updateProjectValues();
    }
    else {
        localStorage.setItem(projectName, JSON.stringify(tasks));
        updateTaskValues(projectName);
    }
    saveDataToFirebase();
}

function updateProjectValues() {
    const allTasks = loadTasks("All Tasks");
    const allProjectNames = getAllProjectNames();
    allProjectNames.forEach(project => {
        const tasks = loadTasks(project);
        tasks.forEach(projectTask => {
            allTasks.forEach(task => {
                if (projectTask.createdAt == task.createdAt) {
                    projectTask.desc = task.desc;
                    projectTask.dueDate = task.dueDate;
                    projectTask.isComplete = task.isComplete;
                    projectTask.title = task.title;
                    projectTask.priority = task.priority;
                }
            });
        });
        localStorage.setItem(project, JSON.stringify(tasks));
    }); 
}

function updateTaskValues(projectName: string) {
    const allTasks = loadTasks("All Tasks");
    const projectTasks = loadTasks(projectName);
    allTasks.forEach(task => {
        projectTasks.forEach(projectTask => {
            if (task.createdAt == projectTask.createdAt) {
                task.desc = projectTask.desc;
                task.dueDate = projectTask.dueDate;
                task.isComplete = projectTask.isComplete;
                task.title = projectTask.title;
                task.priority = projectTask.priority;
            }
        });
    });
    localStorage.setItem("All Tasks", JSON.stringify(allTasks));
}
  
function loadTasks(projectName: string): Task[] {
    if (projectName == "Today's Tasks") {
        return loadTodaysTasks();
    }
    else if (projectName == "This Week's Tasks") {
        return loadWeeksTasks();
    }
    else {
        const tasksLoaded: Task[] = [];
        const taskJSON = localStorage.getItem(projectName);
        if (taskJSON == null || taskJSON == "true") return [];
        const tasks = JSON.parse(taskJSON) as Task[];
        tasksLoaded.push(...tasks);
        return tasksLoaded;
    }
}

function deleteTask(projectName: string, taskName: Task) {
    const allProjectNames = getAllProjectNames();
    allProjectNames.forEach(project => {
        let tasks: Task[] = loadTasks(project);
        tasks = tasks.filter((task) => task.title !== taskName.title);
        saveTasks(tasks, project);
    });
    
}

function saveProject(projects: string[]) {
    localStorage.setItem("Projects", JSON.stringify(projects))
}

function loadProjects(): string[] {
    const taskJSON = localStorage.getItem("Projects");
    if (taskJSON == null) return [];
    return JSON.parse(taskJSON);
}

function deleteProject(projectName: string) {
    let projects = loadProjects();
    projects = projects.filter(project => project !== projectName);
    let tasks: Task[] = loadTasks(projectName);
    tasks.forEach(task => {
        deleteTask("All Tasks", task);
    });
    localStorage.removeItem(projectName);
    saveProject(projects);
    
}

function loadTodaysTasks(): Task[] {
    const projectName = "All Tasks";
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const todayTasks: Task[] = [];

    const taskJSON = localStorage.getItem(projectName);

    if (taskJSON != null) {
        const tasks = JSON.parse(taskJSON) as Task[];
        const tasksToday = tasks.filter(task => {
            const taskDueDate = new Date(task.dueDate);
            taskDueDate.setUTCHours(0, 0, 0, 0);
            return taskDueDate.getTime() === today.getTime();
        });

        todayTasks.push(...tasksToday);
    }

    return todayTasks;
}


function loadWeeksTasks(): Task[] {
    const projectName = "All Tasks";
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    const thisWeekTasks: Task[] = [];

    const taskJSON = localStorage.getItem(projectName);

    if (taskJSON != null) {
        const tasks = JSON.parse(taskJSON) as Task[];
        const tasksThisWeek = tasks.filter(task => {
            const taskDueDate = new Date(task.dueDate);
            taskDueDate.setUTCHours(0, 0, 0, 0);
            return taskDueDate >= today && taskDueDate <= endOfWeek;
        });

        thisWeekTasks.push(...tasksThisWeek);
    }

    return thisWeekTasks;
}


function getAllProjectNames(): string[] {
    const allProjectNames = Object.keys(localStorage);
    return allProjectNames;
}


function saveDataToFirebase() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const localStorageData = localStorage.getItem(key!);

        if (key!.startsWith("firebase")) {
            continue;
        }
  
        if (localStorageData) {
          const parsedData = JSON.parse(localStorageData);
          const projectRef = database.ref(`users/${userId}/projects/${key}`);
          projectRef.set(parsedData)
            .then(() => {
              console.log(`Data for key '${key}' saved to Realtime Database for user '${userId}'`);
            })
            .catch((error) => {
              console.error(`Error saving data for key '${key}' to Realtime Database:`, error);
            });
        }
      }
    } else {
      console.error('No authenticated user found.');
    }
  }
  

  function loadAllDataFromFirebase() {
    const currentUser = auth.currentUser;
  
    if (currentUser) {
      const userId = currentUser.uid;
      const projectsRef = database.ref(`users/${userId}/projects`);
  
      projectsRef.once('value')
        .then((snapshot) => {
          const projectsData = snapshot.val();
  
          if (projectsData) {
            // Iterate over each project and save its data to localStorage
            for (const projectName in projectsData) {
              if (projectsData.hasOwnProperty(projectName)) {
                const projectData = projectsData[projectName];
  
                // Save the data to localStorage
                localStorage.setItem(projectName, JSON.stringify(projectData));
                console.log(`Data for project '${projectName}' saved to localStorage`);
              }
            }
          } else {
            console.error('No projects found in Firebase');
          }
        })
        .catch((error) => {
          console.error('Error loading data from Firebase:', error);
        });
    } else {
      console.error('No authenticated user found.');
    }
  }
  
  
  

export {saveTasks, loadTasks, saveProject, loadProjects, deleteProject, deleteTask};