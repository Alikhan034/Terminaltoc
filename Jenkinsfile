pipeline {
    agent any

    stages {
      stage('Build') {
        steps {
          script {
            dockerImage = docker.build("alikhan034/terminaltoc:${env.BUILD_ID}")
        }
    }
}
        stage('Push') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        dockerImage.push()
                    }
                }
            }
        }

        stage('Test') {
            steps {
                sh 'ls -l index.html' // Simple check for index.html
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Deploy the new version
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: "myawsuserver", 
                                transfers: [sshTransfer(
                                    execCommand: """
                                        docker pull alikhan034/terminaltoc:${env.BUILD_ID}
                                        docker stop terminaltoc-container || true
                                        docker rm terminaltoc-container || true
                                        docker run -d --name terminaltoc-container -p 400:80 alikhan034/terminaltoc:${env.BUILD_ID}
                                    """
                                )]
                            )
                        ]
                    )

                    // Check if deployment is successful
                    boolean isDeploymentSuccessful = sh(script: 'curl -s -o /dev/null -w "%{http_code}" http://54.236.9.55:400', returnStdout: true).trim() == '200'

                    if (!isDeploymentSuccessful) {
                        // Rollback to the previous version
                        def previousSuccessfulTag = readFile('previous_successful_tag.txt').trim()
                        sshPublisher(
                            publishers: [
                                sshPublisherDesc(
                                    configName: "myawsuserver",
                                    transfers: [sshTransfer(
                                        execCommand: """
                                            docker pull alikhan034/terminaltoc:${previousSuccessfulTag}
                                            docker stop terminaltoc-container || true
                                            docker rm terminaltoc-container || true
                                            docker run -d --name terminaltoc-container -p 400:80 alikhan034/terminaltoc:${previousSuccessfulTag}
                                        """
                                    )]
                                )
                            ]
                        )
                    } else {
                        // Update the last successful tag
                        writeFile file: 'previous_successful_tag.txt', text: "${env.BUILD_ID}"
                    }
                }
            }
        }
    }

    post {
        failure {
            mail(
                to: 'alikhan809212@gmail.com',
                subject: "Failed Pipeline: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                body: "Something is wrong with the build ${env.BUILD_URL}"
            )
            }}}
