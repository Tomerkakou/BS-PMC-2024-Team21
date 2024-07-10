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
        stage('Running tests inside docker') {
            steps {
                script {
                    sh 'docker compose run bs-flask pytest -v'
                }
            }
        }
    }
}
