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
    
    stage('Run Backend Tests') {
      steps {
        script {
            sh 'docker  run --rm bs-flask pytest -v'
        }
      }
    }

    stage('Run Docker Containers') {
      steps {
        script {
            // Build the backend Docker image
            sh 'docker compose up -d'
        }
      }
    }

    // stage('Run Frontend Tests') {
    //   steps {
    //     script {
    //       dir('client') {
    //         sh 'docker run --rm bs-pmc-2024-team5-client npm test'
    //       }
    //     }
    //   }
    // }

    // Uncomment and modify the following stage if you need to deploy with Docker Compose
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