pipeline {
    agent any
    stages {
        stage('Build') { 
            steps {
                sh 'npm install'
                sh 'npm run build' 
                sh 'npm run restartPm2'
            }
        }
        stage('Deploy') {
            steps {
                sh 'chmod +rx ./serve.sh'
                sh 'npm run deploy'
            }
        }
    }
}