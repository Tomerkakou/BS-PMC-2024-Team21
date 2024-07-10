pipeline {
    agent any
    stages {
        stage('Build Docker Images and Running tests') {
            steps {
                script {
                    sh 'docker-compose build'
                }
            }
        }
    }
}
