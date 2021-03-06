pipeline {
    agent any
    tools {nodejs "node"}

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
        stage('SonarQube Analysis') 
        {
            steps{
                script {
                    branchName = ""
                    if (!env.BRANCH_NAME.contains("main")) {
                        branchName = "-Dsonar.branch.name=${env.BRANCH_NAME}"
                    }
                    echo "Valor para sonar.branch.name: ${branchName}"
                 }                
                script {
                    def scannerHome = tool 'sonarqube';
                    withSonarQubeEnv("SonarServer") {
                    sh """${tool("sonarqube")}/bin/sonar-scanner ${branchName} \
                    -Dsonar.projectKey=DevOpsTools-app \
                    -Dsonar.sources=. \
                    -Dsonar.css.node=. \
                    -Dsonar.host.url=http://192.168.100.48:9000 \
                    -Dsonar.login=2283b0c9d092de815f199e8b1bcde4113fb40c69"""
                    }
                }  
                sleep(30) 
                script{              
                    def qualitygate = waitForQualityGate();
                    if (qualitygate.status != "OK") {
                        error "Pipeline aborted due to quality gate coverage failure: ${qualitygate.status}"
                    }   
                }      
            }
        }
        stage('Build') {
            agent {
		        docker {
                    image 'node:14.16.0-alpine3.12'
                    args '-p 3001:3001'
		        }
    		}  
            steps {
                echo 'Install dependencies'
                sh 'npm install'

                echo 'Build'
                sh 'node tools-api.js &'
                sleep(10);

                echo 'Unit Testing'
                sh 'npm test'
            }
        }
        stage('Build Docker Image') { 
       		agent any
            steps {
            	script {

                    if ( env.BRANCH_NAME.equals("main") ) {

                        version = ":$BUILD_NUMBER"

                    } else {
                        version = ":" + env.BRANCH_NAME.replace("/", "-") + "-$BUILD_NUMBER"
                    }

                	dockerImageName = registry + version
                	dockerImage = docker.build "${dockerImageName}"
                	docker.withRegistry( '', registryCredential ) {
                		dockerImage.push()
                	}

                    if (env.BRANCH_NAME.equals("master")) {
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