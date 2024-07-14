pipeline {
    agent any

    stages {
        stage('Build Docker Images') {
            steps {
                script {
                    sh 'docker compose build'
                }
            }
        }
        stage('Running Docker') {
            steps {
                script {
                    sh 'docker compose up'
                }
            }
        }
        stage('Test Docker Compose Build') {
            steps {
                script {
                    sh 'curl -f http://localhost:6748' // For Flask
                    sh 'curl -f http://localhost:6749' // For React
                }
            }
        }
        stage('Running tests') {
            steps {
                script {
                    sh 'pytest be/ -v'
                }
            }
        }
  
    }
    post {
        always {
            script {
                // Bring down the Docker Compose services
                //sh 'docker compose down'
                
                // Clean up the workspace
                cleanWs()
            }
        }
    }
}
