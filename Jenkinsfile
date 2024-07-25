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
    stage('Inspect Container File Structure') {
        steps {
            script {
                // Run a temporary container to inspect the file structure
                sh '''
                docker create --name temp-container bs-react
                docker run --rm temp-container /bin/sh -c "ls -la"
                docker rm temp-container
                docker create --name temp-container bs-flask
                docker run --rm temp-container /bin/sh -c "ls -la"
                docker rm temp-container
                '''
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
          sh 'sleep 30' // Increase sleep time if necessary
          sh 'docker ps -a' // List all containers, including stopped ones
          sh 'docker logs bs-flask || true' // Optional: show logs for debugging
          sh 'docker logs bs-react || true' // Optional: show logs for debugging
        }
      }
    }

    stage('Running Tests inside Container') {
      steps {
        script {
            // Build the backend Docker image
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