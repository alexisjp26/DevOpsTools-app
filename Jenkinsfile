pipeline {
    agent none

    environment {
        registry = "alxz26/devops" 
        registryCredential = 'dockerhub'
        dockerImage = ''
        branchName = ''
        version = ''
    }
    options {
        timestamps()
        skipDefaultCheckout()      // Don't checkout automatically
    }

    stages {
        stage('Checkout') {
            agent any
            steps {
                checkout scm
            }
        }
        stage('Build') {
            agent {
                docker {
                    image 'node:14.16.0-alpine3.12'
                    //args '-v /Users/gdelgadoh/.m2:/root/.m2' 
                }
            }  
            steps {
                script {
                    branchName = ''
                    if (!env.BRANCH_NAME.contains("main")) {
                        branchName = env.BRANCH_NAME
                    }
                 }
                echo "Nombre de branch: ${branchName}"

                //echo 'Cobertura'
                //sh 'mvn org.jacoco:jacoco-maven-plugin:prepare-agent install' 
                //jacoco execPattern: '**/target/**.exec'
                //junit '**/target/surefire-reports/*.xml'
                echo 'Quality Gate'  
                script {
                    //def scannerHome = tool 'sonarqube';
                    withSonarQubeEnv("SonarServer") {
                    sh "-Dsonar.projectKey=${branchName} \
                    -Dsonar.sources=. \
                    -Dsonar.css.node=. \"
                    }
                }

                //echo 'Quality Gate'                
                //withSonarQubeEnv('SonarServer') {
                    //sh "mvn org.sonarsource.scanner.maven:sonar-maven-plugin:sonar -Dsonar.branch.name=${branchName}"
                  // }    
                sleep(30)               
                   timeout(time: 1, unit: 'MINUTES') { // Just in case something goes wrong, pipeline will be killed after a timeout
                    waitForQualityGate abortPipeline: true
                   }

                echo 'Compilar'
                sh 'npm install'
                echo 'Build'
                  // sh 'mvn clean package -Dmaven.test.skip=true' 
            }
        }
        stage('Build Docker Image') { 
               agent any
            steps {
                script {

                    if ( branchName.equals("") ) {

                        version = ":$BUILD_NUMBER"

                    } else {
                        version = ":" + branchName.replace("/", "-") + "-$BUILD_NUMBER"
                    }

                    dockerImageName = registry + version
                    dockerImage = docker.build "${dockerImageName}"
                    docker.withRegistry( '', registryCredential ) {
                        dockerImage.push()
                    }

                    if (branchName.equals("")) {
                        docker.withRegistry( '', registryCredential ) {
                            dockerImage.push('latest')
                        }
                        sh "docker rmi " + ${registry} + "latest"
                    }
                    sh "docker rmi $registry$version"     
                } 
                
                             
            }
        } 

    }
}