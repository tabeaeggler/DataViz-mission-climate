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
                //sh 'serve -l 5000 -s build'
                sh 'chmod +rx ./serve.sh'
                sh 'start ./serve.sh'
            }
        }
    }
}