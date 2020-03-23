pipeline {
    agent any
    stages {
        stage('Build') { 
            steps {
                sh 'npm install && npm run build' 
            }
        }
        stage('Deploy') {
            steps {
                sh './serve.sh'
            }
        }
    }
}