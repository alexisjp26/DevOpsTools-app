pipeline {
    agent {
        docker {
            image 'node:14.16.0-alpine3.12'
        }
    }
    stages {
        stage('Build'){
            steps {
                sh 'node -v'
            }
        }
    }
}