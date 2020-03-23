pipeline {
    agent any
    stages {
        stage('Build') { 
            steps {
                sh 'npm install'
                sh 'npm run build' 
            }
        }
        stage('Deploy') {
            steps {
                sh 'chmod +rx npm install -g serve'
                sh 'chmod +rx ./serve.sh'
            }
        }
    }
}