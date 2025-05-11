

ngrok http 8080
java -jar .\jenkins.war --enable-future-java


bitbucket

mayursh-admin


forge login --email FORGE_EMAIL --token FORGE_API_TOKEN


pipeline {
    agent any

    environment {
        FORGE_EMAIL = credentials('FORGE_EMAIL')
        FORGE_API_TOKEN = credentials('FORGE_API_TOKEN')
    }

    stages {
        stage('Install Forge CLI') {
            steps {
                bat 'npm install --global @forge/cli'
            }
        }

        stage('Build App') {
            steps {
                bat 'npm install && cd static/hello-world && npm install && npm run build'
            }
        }

        stage('Deploy Forge App') {
            steps {
                bat 'forge deploy --environment development'
            }
        }

        stage('Install Forge App') {
            steps {
                bat 'forge install --upgrade --site maxatn72.atlassian.net --product jira --non-interactive --environment development'
            }
        }
    }
}
