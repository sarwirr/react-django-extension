pipeline {
    agent { label 'jenkins' }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-jenkins') 
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
                    bash -c "cd taskmaster_backend && python3 -m venv env && source env/bin/activate && pip install -r requirements.txt"
                '''
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo 'Running Django backend tests...'
                sh '''
                    bash -c "cd taskmaster_backend && source env/bin/activate && python manage.py test"
                '''
            }
        }

        stage('Setup Frontend') {
            steps {
                echo 'Installing frontend dependencies...'
                sh '''
                    bash -c "cd frontend && pnpm install"
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building frontend for Chrome extension...'
                sh '''
                    bash -c "cd frontend && pnpm build"
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images for React and Django...'
                script {
                    docker.build("${REACT_IMAGE}:latest", './frontend')
                    docker.build("${DJANGO_IMAGE}:latest", './taskmaster_backend')
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                echo 'Pushing Docker images to DockerHub...'
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-jenkins', usernameVariable: 'sarwirr', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u sarwirr --password-stdin
                        docker push ${REACT_IMAGE}:latest
                        docker push ${DJANGO_IMAGE}:latest
                    '''
                }
            }
        }

    stage('Deploy to Kubernetes') {
        steps {
            echo 'Deploying the application to Kubernetes...'
            sh '''
                /usr/bin/ansible-playbook -i ansible/inventory/hosts ansible/deploy.yml
            '''
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
