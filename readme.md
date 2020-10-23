## Description
A web based framework for managing mulecular machine learning trainings and evaluations.

Consists of two parts
- redox_base: Collection of molecular machine learning algorithms with unified interfaces
- redox_web: A web application, extending the functionality of the base package

Current status
- redox_base: Only contains a modified verion of [blackmints's 3DGCN](https://github.com/blackmints/3DGCN)
- redox_web: A minimal working version
- A useful infrastructure for building a more robust system.

## Initial configuration
This guide will walk you through the necessary steps to make this application work.  
It assumes that you are using a clean install of Ubuntu 18.04.  
Other systems may require further configuration.

### Step 0 - Get the source
Clone this repository to a location of your liking.  
Open a terminal and **cd into the root directory** of the project.

Update your package database
```bash
$ sudo apt update
```

### Step 1 - Installing Conda
We will need a conda environment for managing the project's dependencies.  
One way to obtain conda is by installing Miniconda the following way.

```bash
$ wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
$ chmod +x ./Miniconda3-latest-Linux-x86_64.sh
$ ./Miniconda3-latest-Linux-x86_64.sh
```

Follow the instructions in the terminal. Type *yes* when it asks about running conda init.  
When the process finishes, type the following command:

```bash
$ source ~/.bashrc
```

Now you should see a `(base)` prefix in your prompt, which indicates that the base conda environment is currently active.
We disable this automatic activation by executing
```bash
(base) $ conda config --set auto_activate_base false
$ source ~/.bashrc
``` 

The installation script is no longer needed, so we can remove it
```bash
$ rm ./Miniconda3-latest-Linux-x86_64.sh
``` 

### Step 2 - Installing Redis
The project is configured so that it uses a Redis server as a message queue service.  
This funcionality needed for asynchronous communication with the browser and the machine learning tasks running in the background.

The Redis package in the Ubuntu repositories is outdated, so we have to set up a PPA to install the latest version:
```bash
$ sudo add-apt-repository ppa:chris-lea/redis-server
$ sudo apt-get update
$ sudo apt -y install redis-server
```
The redis server should now already running as a service.  
Our application expects the default settings, so our only thing to do is to verify that it works:
```bash
$ redis-cli ping
PONG
```

### Step 3 - Change the config
Navigate to the `redox_web` directory of the project.
```bash
$ cd ./redox_web
```
This is the root of the web application. We need to set one of it's parameters.  
Let's edit the configuration file `project/settings.py`  
```bash
$ nano ./project/settings.py
```
Find the line containing `DOCUMENT_ROOT = ''`.  
Here you must specify a directory, in which the uploads and training results will be stored.  
Notice the instructions above it. A possible configuration might be
```bash
DOCUMENT_ROOT = '/home/admin/redox/'
```
After setting the value, save and exit the file. `Ctrl + X` + `y`


### Step 4 - Create conda environment

In the `redox_web` directory we have a file named `environment.yml` which enumerates the external libraries used by the application.
We use this file to initialize a conda environment in a new directory called `venv`:

```bash
$ conda env create -f environment.yml --prefix ./venv
$ conda activate venv/
```
As we activated the environment, we can see that the prompt prefix contains the absolute path of the directory, which can be inconvenient.  
We can fix this issue by deactivating this environment and changing the global conda configuration:

```bash
(long/.../prefix) $ conda deactivate
(base) $ conda config --set env_prompt '({name}) '
(base) $ conda activate ./venv
(venv) $
```

```diff
! Notice: all the following commands will require the venv environment to be activated
```

### Step 5 - Initialize the database
We can create the database schema (and an sqlite database) by applying the migrations.
Execute the following command:
``` bash
(venv) $ python manage.py migrate
```
User registration is not implemented yet. We can set up an account in the database with:
``` bash
(venv) $ python manage.py createsuperuser
```

### Step 6 - Start a celery worker
Celery is a task queue. It performs task scheduling for us and it has already been installed by conda.
We need to run the celery worker and our application simultaneously.

For debugging purposes, it is recommended to **open a separate terminal** window for celery, and dont forget to activate the environment too.
``` bash
$ cd redox_web
$ conda activate venv/
(venv) $
```
Now we can start the celery worker by issuing:
``` bash
(venv) $ celery -P threads -A project worker --loglevel=INFO
```

### Step 7 - Start the application
Let's switch to the "unused" terminal. We can start our app with.
``` bash
(venv) $ python manage.py runserver
```
The interface should be now accessible from the browser at http://127.0.0.1:8000

### Step 8 - Example workflow
- Login to the system using the previously set credentials
- Navigate to the Datasets page and create a new dataset
- Click to the newly created dataset and upload the files from the example_data directory (one by one)
- Navigate to the Training page and start a new 3DGCN training with the train and validation datasets
- Wait for the training to finish
- Navigate to the Evaluation page and start a new evaluation with the pretrained model
- Wait for the evaluation to finish
- Download the result and inspect the content

### Step 9 - Notes
Next time you only have to perform Steps 6 and 7.
You can start the celery worker in the background with
``` bash
(venv) $ celery -P threads -A project worker --loglevel=INFO &
```
but there are more sophisticated ways to do this.
You can stop the celery worker by finding and killing the process:
``` bash
(venv) $ ps auxww | grep 'celery' | awk '{print $2}' | xargs kill -9
```
## Development guide
To be added
