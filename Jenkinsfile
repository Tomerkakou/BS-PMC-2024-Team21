pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM',
          branches: [
            [name: '*/main']
          ],
          userRemoteConfigs: [
            [url: 'https://github.com/BS-PMC-2024/BS-PMC-2024-Team21.git',
            credentialsId: '1'
            ]
        ]
        ])
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
            // Build the backend Docker image
            sh 'docker compose build --no-cache'
        }
      }
    }
    
    stage('Run Application') {
      steps {
        script {
            sh 'FLASK_ENV=testing docker compose up -d'
        }
      }
    }

    stage('Checking container') {
      steps {
        script {
          sh 'sleep 5' 
          sh 'docker ps -a' 
          sh 'docker logs bs-flask || true'
          sh 'docker logs bs-react || true' 
        }
      }
    }

    stage('Running Tests inside Container') {
      steps {
        script {
            sh 'docker exec bs-flask pytest -v  /be'
        }
      }
    }

  }

  post {
    always {
      script {
        // Clean up workspace and Docker containers
        sh 'docker compose down'
        cleanWs()
      }
    }
  }
}
