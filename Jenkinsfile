pipeline {
    agent { label 'jenkins' }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('205c8218-5be6-42fb-a01e-69998c04b031') 
        REACT_IMAGE = 'sarwirr/react-extension'
        DJANGO_IMAGE = 'sarwirr/django-backend'
        KUBECONFIG = '/path/to/kubeconfig' 
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning repository...'
                git url: 'https://github.com/sarwirr/react-django-extension.git', branch: 'master'
            }
        }

        stage('Setup Backend') {
            steps {
                echo 'Setting up Python virtual environment and installing backend dependencies...'
                sh '''
                    cd backend
                    python3 -m venv env
                    source env/bin/activate
                    pip install -r requirements.txt
                '''
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo 'Running Django backend tests...'
                sh '''
                    cd backend
                    source env/bin/activate
                    python manage.py test
                '''
            }
        }

        stage('Setup Frontend') {
            steps {
                echo 'Installing frontend dependencies...'
                sh '''
                    cd frontend
                    pnpm install
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building frontend for Chrome extension...'
                sh '''
                    cd frontend
                    pnpm build
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images for React and Django...'
                script {
                    docker.build("${REACT_IMAGE}:latest", './frontend')
                    docker.build("${DJANGO_IMAGE}:latest", './backend')
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                echo 'Pushing Docker images to DockerHub...'
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'DOCKERHUB_CREDENTIALS') {
                        docker.image("${REACT_IMAGE}:latest").push()
                        docker.image("${DJANGO_IMAGE}:latest").push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying the application to Kubernetes...'
                sh '''
                    ansible-playbook -i inventory/hosts deploy.yml
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs and resolve issues.'
        }
    }
    
}
