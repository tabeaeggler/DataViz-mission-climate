pipeline {
    agent any
    stages {
        stage('Build Frontend') { 
            steps {
                sh 'npm install && npm run build' 
            }
        }
        stage('Deploy Frontend') {
            steps {
                sh 'npm run deploy'
            }
        }
    }
}