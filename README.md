# react-django-extension

## Prerequisites

### Set up Virtual Environment

  Using **env** (preferred)

- To **create** virtual environment:
    ```Shell
    $ python3 -m venv env
    ``` 
- To **activate** virtual environment (Linux/Mac OS):
    ```Shell
    $ source env/bin/activate
    ``` 

## Setting up the Backend

```
$ mkdir (DIR_NAME)
$ cd (DIR_NAME)
``` 

### Install dependencies
Run the following command inside your virtual environment:
   ``` 
- Using **venv**:
    ```Shell
    $ pip install -r requirements.txt # (Python 2)
    $ pip3 install -r requirements.txt # (Python 3)
   ```

###  Test the Web Application
You can check whether everything is working by **running both React and Django concurrently** at your local development server:

```Shell
$ npm start
$ python manage.py runserver
``` 

