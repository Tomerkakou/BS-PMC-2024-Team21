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
        // stage('Test Docker Compose Build') {
        //     steps {
        //         script {
        //             sh 'docker-compose up -d'
                    

        //             sh 'curl -f http://localhost:5000' // For Flask
        //             sh 'curl -f http://localhost:3000' // For React
        //         }
        //     }
        // }
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