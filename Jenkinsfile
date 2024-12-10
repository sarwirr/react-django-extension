pipeline {
    agent { label 'jenkins' }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-jenkins') 
        REACT_IMAGE = 'sarwirr/react-extension'
        DJANGO_IMAGE = 'sarwirr/django-backend'
        KUBECONFIG = '/path/to/kubeconfig'
        AZURE_CREDENTIALS_ID = 'azure-jenkins-sp' 
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
                withCredentials([usernamePassword(credentialsId: 'dockerhub-jenkins', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
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
                    kubectl apply -f k8s/namespace.yaml --validate=false
                    kubectl apply -f k8s/backend-deployment.yaml --validate=false
                    kubectl apply -f k8s/frontend-deployment.yaml --validate=false
                    kubectl apply -f k8s/ingress.yaml --validate=false
                '''
            }
        }

        stage('Login to Azure') {
            steps {
                script {
                    withCredentials([azureServicePrincipal(credentialsId: env.AZURE_CREDENTIALS_ID)]) {
                        sh '''
                            az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET --tenant $AZURE_TENANT_ID
                            az account set --subscription $AZURE_SUBSCRIPTION_ID
                        '''
                    }
                }
            }
        }
        // Additional stages to deploy resources, run tests, etc.
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
