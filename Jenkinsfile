pipeline {
    agent { 
        docker { 
            image 'node' 
            args '-u 0'
        } 
    }
    stages {
        stage('Init') {
            steps {
                sh 'wget -nc https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.2.0.1873-linux.zip'
                sh 'unzip -n sonar-scanner-cli-4.2.0.1873-linux.zip'
                sh 'mv sonar-scanner-4.2.0.1873-linux /opt/sonar-scanner'
                sh 'npm install -g typescript'
                sh 'npm install'
                sh 'npm link typescript'
            }
        }
        stage('Linting') {
            steps {
                sh 'touch eslint-result.xml'
                sh './node_modules/.bin/eslint -f checkstyle src/**/* > eslint-result.xml ||exit 0'

                recordIssues (
                    enabledForFailure: true, 
                    tool: esLint(pattern: '**/eslint-result.xml'), 
                    healthy: 10, 
                    unhealthy: 100, 
                    failOnError: true,
                    minimumSeverity: 'HIGH', 
                    qualityGates: [
                        [
                            threshold: 10, 
                            type: 'TOTAL'
                        ]
                    ] 
                )

                script {
                    if (currentBuild.currentResult == 'FAILURE' ) {
                        sh 'exit 1'
                    } 
                }
            }
        }
        stage('Testing') {
            steps {
                sh 'npm test'
            }
        }
        stage('Code Coverage') {
            steps {
                sh '/opt/sonar-scanner/bin/sonar-scanner -Dsonar.projectKey=BA_Test_B -Dsonar.sources=./src -Dsonar.host.url=http://192.168.2.100:9000 -Dsonar.login=cf7c5f86728a5bb40d66b650ca72707890a4f274'
            }
        }
        stage('Documentation') {
            steps {
                sh 'npm run docs'
                publishHTML (target : [allowMissing: false,
                             alwaysLinkToLastBuild: false,
                             keepAll: false,
                             reportDir: './docs',
                             reportFiles: 'index.html',
                             reportName: 'Documentation',
                             reportTitles: 'Documentation'])
            }
        }
    }
}