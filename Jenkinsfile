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
                sh 'chmod u=rwx,g=rwx,o=rwx ./serve.sh'
                sh 'npm run deploy'
            }
        }
    }
}